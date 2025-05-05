#!/usr/bin/env perl
use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

package App::GeneralPreprocessor 0.01;
use parent qw(App::Cmd::Simple);
use namespace::autoclean;
use Carp;
use Path::Tiny;
use Storable qw(dclone);

require General::ConflictGroup;
require General::Importer;
require General::PairBuilder;
require Item::Ascension;
require Item::SkillBooks;
require Item::Specialities;

my $cg;
my $ascension;
my $generals;
my $skillBooks;
my $specialities;

sub opt_spec {
  return (
    [ "output|o=s", "output directory", { required => 1  } ],
    [ "conflicts|c=s",  "conflicts file", {required => 1 } ],
    [ "input|i=s", "input directory containing collections", {required => 1}] ,
  );
}

sub validate_args {
  my ($self, $opt, $args) = @_;
  # no args allowed but options!
  $self->usage_error("No args allowed") if @$args;
}

sub execute {
  my ($self, $opt, $args) = @_;
  if($opt->{output} and $opt->{conflicts} and $opt->{input}) {

    my $outputDir = path($opt->{output});
    if(!$outputDir->is_dir()){
      exit(1);
    }

    my $input = path($opt->{input});
    if(!$input->is_dir()){
      exit(1);
    }

    imports($input, $outputDir, $opt->{conflicts});

    if(!$outputDir->child('pairs')->is_dir()) {
      $outputDir->child('pairs')->mkdir({
        mode  => 0710,
      })
    }

    my $pb = General::PairBuilder->new(
      generals  => dclone($generals),
      conflicts => dclone($cg->conflictGroups),
      outputDir => $outputDir->child('pairs'),
    );

    $pb->build();

    #set up typescript 'index' files that let me know what is in the collection
    my @groups =  $outputDir->child('generalConflictGroups')->children(qr/\.json\z/);

    my $collectionFile = $outputDir->child('generalConflictGroups')->child('collection.ts');
    $collectionFile->touch();

    my $cfHandle = $collectionFile->openw_utf8();

    print { $cfHandle } "const collection = [\n";

    foreach my $group (@groups) {
        print { $cfHandle } qq{  "$group",\n};
    }

    print { $cfHandle } "];\n";
    print { $cfHandle } "export default collection;\n";

  } else {
    say 'Invalid Args Specified, not doing conversion.';
  }
}

sub imports ($input, $output, $conflictsFile) {

  my $importer = General::Importer->new(
    outputDir => $output->child('generals'),
    inputDir  => $input->child('generals'),
  );
  $generals = $importer->importAll();

  my $conflicts = path($conflictsFile);
  if($conflicts->is_file()) {
    say "$conflicts is a file";
  }

  $cg = General::ConflictGroup->new(
    outputDir => $output->child('generalConflictGroups'),
  );

  $cg->fromEvAnsCSV($conflictsFile);

  $ascension = Item::Ascension->new(
    inputDir  => $input->child('ascending attributes'),
    outputDir => $output->child('ascending attributes'),
  );
  $ascension->importAll();

  $skillBooks = Item::SkillBooks->new(
    inputDir  => $input->child('SkillBooks'),
    outputDir => $output->child('SkillBooks'),
  );
  $skillBooks->importAll();

  $specialities = Item::Specialities->new(
    inputDir  => $input->child('specialities'),
    outputDir => $output->child('specialities'),
  );
  $specialities->importAll();

}
