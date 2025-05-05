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

  field $general :param :reader;


};
1;
