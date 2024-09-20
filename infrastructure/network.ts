
// eslint-disable-next-line no-undef
export const vpc = new sst.aws.Vpc("EvonyVPC", {
    nat: "managed",
    az: 2,
  });

