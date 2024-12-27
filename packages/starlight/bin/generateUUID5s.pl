#!/usr/bin/env perl

use v5.40.0;
use utf8::all;
use Carp;
use Data::Printer;
use Path::Tiny qw(path);
use UUID;
use X500::DN;
use X500::RDN;# see EXPORTS

my $uuidBase = "35761780-4eee-55db-b913-cf765fa95bf3";

my $base = X500::DN->new(
  X500::RDN->new('ou' => 'Generals'),
  X500::RDN->new('dc' => 'evonytkrtips'),
  X500::RDN->new('dc' => 'net')
);

my $ub = UUID::uuid5(dns => 'evonytkrtips.net');
my $ub2 = UUID::uuid5($ub, "Generals");

say "ub2 is $ub2";
say "or is $uuidBase";
say sprintf("base is %s", $base->getRFC2253String());

my @files = glob("./src/assets/generalConflictGroups/*.yaml");
foreach my $file (@files) {
  my @stack = split('/', $file);
  my $shortname = pop( @stack);
  my $new = UUID::uuid5($ub2,  $shortname);

  my $old = '';
  open my $fh, '<:encoding(UTF-8)', $file or die;
  while (my $line = <$fh>) {
    if($line =~ /name: (\w+)/) {
      $old = $1;
      if($old ne 'March' && $old ne 'Siege' && $old ne 'Ranged' && $old ne 'Mounted' && $old ne 'Ground' && $old ne 'Luck' && $old ne 'MonstersMounted') {
        say "$file: old is $old";
        last;
      }
    }
  }
  close $fh;
  say "generated $new to replace $old for $file";
  foreach my $f2 (@files) {
    my $fixing = path($f2);
    my $data = $fixing->slurp_utf8();

    $data =~ s/$old/$new/g;
    $fixing->spew_utf8($data);
  }
}
