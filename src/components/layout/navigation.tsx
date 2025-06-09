import { DesktopNavigation } from './desktop-navigation';
import { MobileBottomNavigation } from './mobile-bottom-navigation';
import { MobileTopNavigation } from './mobile-top-navigation';

export function Navigation() {
    return (
        <>
            {/* Navigation Desktop - Cachée sur mobile */}
            <div className='hidden lg:block'>
                <DesktopNavigation />
            </div>

            {/* Navigation Mobile - Affichée uniquement sur mobile */}
            <div className='lg:hidden'>
                <MobileTopNavigation />
                <MobileBottomNavigation />
            </div>
        </>
    );
}
