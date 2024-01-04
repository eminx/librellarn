import { createConfig } from '@gluestack-ui/themed';

export const config = createConfig({
  tokens: {
    colors: {
      primary600_alpha_10: '#1a91ff1a',
      primary600_alpha_20: '#1a91ff33',
    },
  },

  components: {
    Input: {
      props: {
        editable: false,
        selectTextOnFocus: false,
      },
    },
  },
});
