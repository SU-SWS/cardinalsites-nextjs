import {MenuItem} from "@lib/gql/__generated__/drupal.d";

const useActiveTrail = (menuItems: MenuItem[], currentPath?: string) => {

  const getActiveTrail = (menuItems: MenuItem[], trail: string[] = []): string[]  => {
    let childTrail, currentTrail;
    for (let i = 0; i < menuItems.length; i++) {
      currentTrail = [...trail];
      currentTrail.push(menuItems[i].id);

      if (currentPath === menuItems[i].url) {
        return currentTrail;
      }

      const childrenItems = menuItems[i].children;

      if (childrenItems) {
        childTrail = getActiveTrail(childrenItems, [...currentTrail]);
        if (childTrail.length > 0) {
          return childTrail;
        }
      }

    }
    return [];
  };

  return getActiveTrail(menuItems);
}

export default useActiveTrail;