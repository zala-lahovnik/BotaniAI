import { Dialog } from '@rneui/base';
import { global } from '../../styles/globals';

export const SignInLoadingModal = ({ loading }: { loading: boolean }) => {
  return (
    <Dialog isVisible={loading}>
      <Dialog.Title
        title="Logging in..."
        titleStyle={{ color: global.color.heading.color, fontSize: 20 }}
      />
      <Dialog.Loading />
    </Dialog>
  );
};
