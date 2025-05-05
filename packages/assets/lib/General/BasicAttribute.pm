use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;

class General::BasicAttribute {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Cwd;
  use Storable qw(dclone);
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $base :param :reader //= 0;
  field $increment :param :reader //= 0;
  field $attribute :param :reader;

  field $allowedAttributes = [
    "attack",
    "defense",
    "leadership",
    "politics",
  ];

  ADJUST {
    if(none { $_ eq $attribute } @{ $allowedAttributes }) {
      croak("attribute $attribute is not one of " . join(@{ $allowedAttributes }, ", "));
    }
  }

  field $BasicAESAdjustment = {
    None    => 0,
    purple1 => 0,
    purple2 => 0,
    purple3 => 0,
    purple4 => 0,
    purple5 => 0,
    red1    => 10,
    red2    => 20,
    red3    => 30,
    red4    => 40,
    red5    => 50,
  };

  field $BasicStarAdjustment = {
    1 => {
      attack      => 50,
      defense     => 48,
      leadership  => 47,
      politics    => 46,
    },
  };




};
1;
