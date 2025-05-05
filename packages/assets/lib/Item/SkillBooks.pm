use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;

class Item::SkillBooks {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Storable qw(dclone);
  use Cwd;
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $outputDir :reader :param;
  field $inputDir :reader :param;

  field $id;
  field $od;

  field $items = {};

  ADJUST {
    my $tp;

    $tp = Path::Tiny::path($inputDir);
    if($tp->exists()){
      if($tp->is_dir()) {
        $id = $tp;
      } else {
        croak "$inputDir is not a directory!!";
      }
    } else {
      croak "$inputDir does not exist!"
    }

    $tp = Path::Tiny::path($outputDir);
    if($tp->exists()){
      if($tp->is_dir()){
        $od = $tp;
      } else {
        croak "$outputDir is not a directory!!";
      }
    }else {
      croak "$outputDir does not exist!"
    }
  }

  method importAll () {
      my @SkillBookFiles = $id->children(qr/\.yaml\z/);

      my $ypp = YAML::PP->new(
          schema        => [qw/ + Perl /],
          yaml_version  => ['1.2', '1.1'],
      );


      foreach my $SkillBookFile (@SkillBookFiles) {
          $SkillBookFile = Path::Tiny::path(Encode::decode('utf8', $SkillBookFile->stringify()));
          my $SkillBookData = $SkillBookFile->slurp_utf8;
          my $SkillBook = $ypp->load_string($SkillBookData);

          next unless ref $SkillBook eq 'HASH' && $SkillBook->{name};

          $items->{ $SkillBook->{name} } = dclone($SkillBook);
      }

  }

};
1;
