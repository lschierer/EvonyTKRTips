use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;

class Item::Specialities {
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
      my @SpecialityFiles = $id->children(qr/\.yaml\z/);

      my $ypp = YAML::PP->new(
          schema        => [qw/ + Perl /],
          yaml_version  => ['1.2', '1.1'],
      );


      foreach my $SpecialityFile (@SpecialityFiles) {
          $SpecialityFile = Path::Tiny::path(Encode::decode('utf8', $SpecialityFile->stringify()));
          my $SpecialityData = $SpecialityFile->slurp_utf8;
          my $Speciality = $ypp->load_string($SpecialityData);

          next unless ref $Speciality eq 'HASH' && $Speciality->{name};

          $items->{ $Speciality->{name} } = dclone($Speciality);
      }

  }

};
1;
