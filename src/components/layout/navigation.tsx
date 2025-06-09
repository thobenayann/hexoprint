import { DesktopNavigation } from './desktop-navigation';
import { MobileBottomNavigation } from './mobile-bottom-navigation';
import { MobileTopNavigation } from './mobile-top-navigation';

export function Navigation() {
    return (
        <>
            {/* Navigation Desktop */}
            <DesktopNavigation />

            {/* Navigation Mobile */}
            <MobileTopNavigation />
            <MobileBottomNavigation />
        </>
    );
}
