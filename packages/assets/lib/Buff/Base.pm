use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;

class Buff::Object {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Storable qw(dclone);
  use Cwd;
  use namespace::autoclean;
  use Carp;
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $allowedAttributes = [
  "Attack",
  "Death to Soul",
  "Death to Survival",
  "Death to Wounded",
  "Defense",
  "Deserter Capacity",
  "Double Items Drop Rate",
  "HP",
  "Hospital Capacity",
  "March Size Capacity",
  "Marching Speed to Monsters",
  "Marching Speed",
  "Rally Capacity",
  "Resources Production",
  "Stamina cost",
  "SubCity Construction Speed",
  "SubCity Gold Production",
  "SubCity Training Speed",
  "SubCity Troop Capacity",
  "Training Capacity",
  "Training Speed",
  "Wounded to Death",
  ];

  field $allowedTroopClass = [
    "Ground Troops",
    "Mounted Troops",
    "Ranged Troops",
    "Siege Machines",
    "All",
  ];

  field $allowedBuffActivation = [
    "Overall",
    "PvM",
    "Attacking",
    "Reinforcing",
    "Defense",
    "In City",
    "Out City",
    "Wall",
    "Mayor",
    "Officer",
  ];

  field $allowedBuffConditions = [
    "Against Monsters",
    "Attacking",
    "brings a dragon",
    "brings dragon or beast to attack",
    "Defending",
    "dragon to the attack",
    "leading the army to attack",
    "Marching",
    "Reinforcing",
    "When City Mayor for this SubCity",
    "When Defending Outside The Main City",
    "When Rallying",
    "In Main City",
    "When the Main Defense General",
  ];

  field $allowedDebuffConditions = [
    "Enemy",
    "Enemy In City",
    "Reduces",
    "Reduces Enemy",
    "Reduces Enemy in Attack",
    "Reduces Enemy with a Dragon",
    "Reduces Monster",
  ];

  field $allowedBookConditions = [
    "all the time",
    "when not mine",
  ];

  field $allowedConditions = [];

  ADJUST {
    my %seen;
    $allowedConditions = grep { not $seen{$_}++ } (
      @{ $allowedBuffConditions },
      @{ $allowedDebuffConditions },
      @{ $allowedBookConditions }
    );
  }

  field $allowedValueUnits = [
    "flat", "percentage",
  ];

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
