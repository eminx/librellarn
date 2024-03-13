import { Button, Icon, Menu, MenuItem, MenuItemLabel } from '@gluestack-ui/themed';
import { MoreVertical } from 'lucide-react-native';

import { i18n } from '../../i18n';

export default function HeaderMenu({}) {
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
        <MenuItem key="Community" textValue="Community">
          <MenuItemLabel size="sm">{i18n.t('generic.report')}</MenuItemLabel>
        </MenuItem>
      </Menu>
    </>
  );
}
