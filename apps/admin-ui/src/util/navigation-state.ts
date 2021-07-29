import { Navigation } from '@angular/router';

export default {
  getStateObject: (navigation: Navigation | null) => {
    if (!navigation) {
      return undefined;
    }
    return navigation.extras.state;
  }
};
