use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;
require General::BasicAttribute;

class General::BasicAttributes {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Cwd;
  use Storable qw(dclone);
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $attack :reader;

  field $defense:  :reader;

  field $leadership:  :reader;

  field $politics:  :reader;

  ADJUST {
    my $ac = blessed $attack;
    my @acc = split('::', $ac);
    if($acc[1] ne 'BasicAttribute'){
      croak("attack is a $ac, not a General::BasicAttribute");
    }

    my $dc = blessed $defense;
    my @dcc = split('::', $dc);
    if($dcc[1] ne 'BasicAttribute'){
      croak("defense is a $dc, not a General::BasicAttribute");
    }

    my $lc = blessed $leadership;
    my @lcc = split('::', $lc);
    if($lcc[1] ne 'BasicAttribute'){
      croak("leadership is a $lc, not a General::BasicAttribute");
    }

    my $pc = blessed $politics;
    my @pcc = split('::', $pc);
    if($pcc[1] ne 'BasicAttribute'){
      croak("politics is a $pc, not a General::BasicAttribute");
    }
  }

  method setAttack ($base, $increment) {
    $attack->{base} = $base;
    $attack->{increment} = $increment;
  }

  method setDefense ($base, $increment) {
    $defense->{base} = $base;
    $defense->{increment} = $increment;
  }

  method setLeadership ($base, $increment) {
    $leadership->{base} = $base;
    $leadership->{increment} = $increment;
  }

  method setPolitics ($base, $increment) {
    $politics->{base} = $base;
    $politics->{increment} = $increment;
  }
};
1;
