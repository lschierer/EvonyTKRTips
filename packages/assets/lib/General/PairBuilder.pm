use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;

class General::PairBuilder {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Cwd;
  use Storable qw(dclone);
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;


  field $generals :param;
  field $conflicts :param;
  field $outputDir :param;

  field $allPairs = [];
  field $pairsByType = {
    ground  => [],
    ranged  => [],
    mounted => [],
    siege   => [],
    wall    => [],
  };

  field $od;

  field $conflictMap = {};

  ADJUST {
    my $tp;

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

  method build () {
    $self->buildConfictMap();
    $self->buildPairs();
    say Data::Printer::p($allPairs);
  }

  method buildConfictMap ( ) {
    foreach my $group (keys %{$conflicts}) {
      my %seen = ();
      foreach my $member (@{ $conflicts->{$group}->{members} }) {
        foreach my $m2 (@{ $conflicts->{$group}->{members} }) {
          if($member eq $m2) {
            next;
          }
          push(@{ $conflictMap->{$member} }, $m2) unless $seen{$m2}++;
        }

        if(exists $conflicts->{$group}->{others}) {
          foreach my $other (@{ $conflicts->{$group}->{others} }) {
            foreach my $m3 (@{ $conflicts->{$other}->{members} }) {
              if($member eq $m3) {
                next;
              }
              push(@{ $conflictMap->{$member} }, $m3) unless $seen{$m3}++;
            }
          }
        }
      }

    }
  }

  method buildPairs ( ) {
    foreach my $primary (keys %{$generals}) {
      foreach my $secondary (keys %{$generals}) {
        if($primary eq $secondary){
          next;
        }
        if(none { $_ =~ /$secondary/ } @{ $conflictMap->{ $primary } }) {
          push @{ $allPairs }, {
            primary   => dclone($generals->{$primary}),
            secondary => dclone($generals->{$secondary}),
          };
        }
      }
    }
  }

  method buildFilteredPairGroups {
    my @types = qw(ground ranged mounted siege wall);


    foreach my $pair (@{ $allPairs }) {
      foreach my $type (@types) {
        if(any {$_ =~ /^$type/i } @{$pair->{primary}->{type}}) {
          if(any {$_ =~ /^$type/i } @{$pair->{secondary}->{type}}) {
            push @{ $pairsByType->{$type} }, $pair;
          }
        }
      }
    }
  }
};
1;
