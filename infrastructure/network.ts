
// eslint-disable-next-line no-undef
export const vpc = new sst.aws.Vpc("EvonyVpc", {
    nat: "managed",
    az: 2,
  });

