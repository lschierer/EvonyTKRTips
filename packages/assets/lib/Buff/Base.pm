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

  field $allowedAttributes :reader = [
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

  field $allowedTroopClass :reader = [
    "Ground Troops",
    "Mounted Troops",
    "Ranged Troops",
    "Siege Machines",
    "All",
  ];

  field $allowedBuffActivation :reader = [
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

  field $allowedBuffConditions :reader = [
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

  field $allowedDebuffConditions :reader = [
    "Enemy",
    "Enemy In City",
    "Reduces",
    "Reduces Enemy",
    "Reduces Enemy in Attack",
    "Reduces Enemy with a Dragon",
    "Reduces Monster",
  ];

  field $allowedBookConditions :reader = [
    "all the time",
    "when not mine",
  ];

  field $allowedConditions :reader = [];

  ADJUST {
    my %seen;
    $allowedConditions = grep { not $seen{$_}++ } (
      @{ $allowedBuffConditions },
      @{ $allowedDebuffConditions },
      @{ $allowedBookConditions }
    );
  }

  field $allowedValueUnits :reader = [
    "flat", "percentage",
  ];

};
1;
