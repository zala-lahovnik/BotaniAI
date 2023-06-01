import { Dialog } from '@rneui/base';
import { global } from '../../styles/globals';

export const LoadingModal = ({
  loading,
  title = 'Logging in...',
}: {
  loading: boolean;
  title?: string;
}) => {
  return (
    <Dialog isVisible={loading}>
      <Dialog.Title
        title={title}
        titleStyle={{ color: global.color.heading.color, fontSize: 20 }}
      />
      <Dialog.Loading />
    </Dialog>
  );
};
