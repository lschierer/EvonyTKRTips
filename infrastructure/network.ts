

export const vpc = new sst.aws.Vpc("EvonyVPC", {
    nat: "managed",
    az: 2,
  });

  