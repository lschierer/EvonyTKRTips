use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;
require Buff::Base;

class Buff::Object :isa(Buff::Base) {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Storable qw(dclone);
  use Cwd;
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $attribute :reader :param;
  field $conditions :reader :param //= [];
  field $troopClass :reader :param;
  field $valueNumber :reader :param;
  field $valueUnit :reader :param //= 'percentage';

  ADJUST {
    if( none {$_ eq $attribute } @{ $allowedAttributes }) {
      croak("attribute $attribute is not in " . join @{ $allowedAttributes }, ' ');
    }

    foreach my $c (@{ $conditions }) {
      if( none { $_ eq $c } @{ $allowedConditions }) {
        croak("condition $c is not in " . join(@{ $allowedConditions }, ', ') );
      }
    }

    foreach my $tc (@{ $troopClass }) {
      if( none { $_ eq $tc } @{ $allowedTroopClass }) {
        croak("condition $c is not in " . join(@{ $allowedTroopClass }, ', ') );
      }
    }
  }

};
1;
