use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;
require General::BasicAttributes;

class General::Object {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Cwd;
  use Storable qw(dclone);
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $ascendable :param :reader //= true;

  field $ascendingLevels = {};

  field $stars :reader :param //= None;

  field $basic :reader = General::BasicAttributes->new();

  field $bookName :reader :param;

  field $name :reader :param;

  field $specialityNames :reader :param;

  field $type :reader = [];

  field $extra :reader = [];

};
1;
