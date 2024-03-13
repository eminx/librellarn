import { Button, Icon, Menu, MenuItem, MenuItemLabel, useToast } from '@gluestack-ui/themed';
import { MoreVertical } from 'lucide-react-native';

import { i18n } from '../../i18n';
import { call } from '../utils/functions';
import Toast from './Toast';

export default function HeaderMenu({ contentId, context }) {
  const toast = useToast();

  const reportContent = async () => {
    try {
      console.log(contentId, context);
      await call('reportContent', contentId, context);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={i18n.t('generic.reported')} />,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menu
        placement="bottom left"
        trigger={({ ...triggerProps }) => {
          return (
            <Button variant="link" {...triggerProps}>
              <Icon as={MoreVertical} m="$2" w="$4" h="$4" />
            </Button>
          );
        }}
      >
        <MenuItem key="Community" textValue="Community" onPress={() => reportContent()}>
          <MenuItemLabel size="sm">{i18n.t('generic.report')}</MenuItemLabel>
        </MenuItem>
      </Menu>
    </>
  );
}
