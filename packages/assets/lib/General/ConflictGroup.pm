use v5.40.0;
use experimental qw(class);
use utf8::all;
use File::FindLib 'lib';

require Data::Printer;
require Path::Tiny;
require YAML::PP;

class General::ConflictGroup {
  use Types::Common qw( -lexical -all);
  use List::AllUtils qw( any none );
  use Text::CSV qw (csv);
  use Storable qw(dclone);

  use Cwd;
  use namespace::autoclean;
  use Carp;
  use UUID::Tiny ':std';
  our $VERSION = 'v0.0.1';
  my $debug = 1;

  field $outputDir :reader :param;

  field $id;
  field $od;

  field $conflictGroups :reader = {};

  # Base UUID for generalConflict file names
  my $BASE_UUID = 'b3250a16-fb7e-5ccf-a398-4dcffe70ca6a';

  ADJUST {

    my $tp;

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

  # Generate UUID5 from a string using the base UUID
  method _generate_uuid ($text) {
    return create_uuid_as_string(UUID_V5, $BASE_UUID, $text);
  }

  method fromEvAnsCSV ($fileName) {
    my $csvPath = Path::Tiny::path($fileName);
    if($csvPath->is_file()) {
      say "ready to read in '$csvPath'";

      # Open the file directly instead of slurping
      my $fh = $csvPath->openr_utf8();

      my $csv = Text::CSV->new({
        binary      => 1,
        auto_diag   => 1,
        decode_utf8 => 1,
      });

      if($csv) {
        # Read the header row first to get column positions
        my $header = $csv->getline($fh);
        $csv->column_names(@$header);

        # Find the index of the columns we need
        my $name_idx = 1;  # Name is in the first column
        my $bsc_codes_idx = 4;  # BSC Codes is in the 3rd column
        my $senate_idx = 2;

        # Store data by BSC code
        my %bsc_data;
        my %generals_by_bsc;

        # the incoming csv has duplicate entries
        my %seen;


        # Process each row
        while (my $row = $csv->getline($fh)) {
          my $raw_name = $row->[$name_idx];
          (my $name = $raw_name) =~ s/\s*\[\w+(?:\/\w+)?\]\s*//g;
          my $bsc_codes = $row->[$bsc_codes_idx];
          my $useCategory = $row->[$senate_idx];

          # $seen{$name}++ returns the previous value
          next if $seen{$name}++;
          # this in combination with the $raw name filter
          # gets rid of duplicate entries from EvAns [D/S] type notations

          # Skip rows with empty or invalid BSC codes
          next if !$bsc_codes || $bsc_codes eq '#N/A' || $bsc_codes eq '-';
          if ($useCategory !~ /(Development|Ground|Mixed|Mounted|Ranged|Siege)/) {
            say "useCategory '$useCategory' is invalid";
            next;
          }

          # Store general name by BSC code
          push @{$generals_by_bsc{$bsc_codes}}, $name;

          # Store BSC code for later processing
          $bsc_data{$bsc_codes} = $useCategory;
        }

        # Process each unique BSC code
        foreach my $bsc_code (keys %bsc_data) {
          # Split the BSC code by hyphens
          my @bsc_parts = split('-', $bsc_code);

          # Find other BSC codes that share a substring
          my @others;
          foreach my $other_code (keys %bsc_data) {
            next if ($other_code eq $bsc_code);

            my $useCategory = $bsc_data{$other_code};
            say "bsc useCategory is '$useCategory'";

            my @other_parts = split('-', $other_code);

            # Check if any part of bsc_code matches any part of other_code
            foreach my $part (@bsc_parts) {
              if (any { $_ eq $part } @other_parts) {
                if($self->map_bsc_to_useCategory($part) eq $useCategory){
                  push @others, $self->_generate_uuid($other_code);
                  last;
                }
                if($useCategory =~ /(Mixed|Development)/) {
                  push @others, $self->_generate_uuid($other_code);
                  last;
                }
              }
            }
          }

          # Create YAML content
          my $yaml_content = {
            'name' => $self->_generate_uuid($bsc_code),
            'members' => $generals_by_bsc{$bsc_code},
            'others' => \@others
          };

          # Create filename
          my $filename = "$bsc_code.yaml";
          my $filepath = $od->child($filename);

          # Write YAML file
          $self->_write_yaml_file($filepath, $yaml_content);

          # store for later useCategory
          my $name = $yaml_content->{name} // '[missing name]';
          $self->conflictGroups->{ $name } = dclone($yaml_content);

          say "Created $filepath";
        }

        say "Created " . scalar(keys %bsc_data) . " YAML files in $od";
      } else {
        warn "Failed to create CSV parser: " . Text::CSV->error_diag();
      }
    } else {
      croak("'$fileName' is not available to read");
    }
  }

  method map_bsc_to_useCategory ($bsc) {
    if ($bsc =~ /^GR/ ){
      return 'Ground';
    }
    if ($bsc =~ /^RA/ )  {
      return 'Ranged';
    }
    if($bsc =~ /^MT/) {
      return 'Mounted';
    }
    if( $bsc =~ /^SG/ ) {
      return 'Siege';
    }
    return 0;
  }

  method _write_yaml_file ($filepath, $content) {
    my $ypp = YAML::PP->new(schema => [qw/ + Perl /]);


    my $yaml = $ypp->dump_string($content);
    $filepath->spew_utf8($yaml);
  }
};
1;
