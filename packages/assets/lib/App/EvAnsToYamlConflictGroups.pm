#!/usr/bin/env perl
use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

package App::EvAnsToYamlConflictGroups 0.01;
use parent qw(App::Cmd::Simple);
use namespace::autoclean;
use Carp;
use Path::Tiny;
require General::ConflictGroup;

sub opt_spec {
  return (
    [ "output|o=s", "output directory", { required => 1  } ],
    [ "input|i=s",  "input directory", {required => 1 } ],
  );
}

sub validate_args {
  my ($self, $opt, $args) = @_;
  # no args allowed but options!
  $self->usage_error("No args allowed") if @$args;
}

sub execute {
  my ($self, $opt, $args) = @_;
  if($opt->{output} and $opt->{input}) {
    my $input = path($opt->{input});
    if($input->is_file()) {
      say "$input is a file";

    }
    my $cg =  General::ConflictGroup->new(
      outputDir => $opt->{output},
    );
    $cg->fromEvAnsCSV($input);
  } else {
    say 'Invalid Args Specified, not doing conversion.'
  }
}
