import styles from './layout.module.css';
import Link from 'next/link';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <aside className={styles.navbar}>
                <nav>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/user">
                                <span className={styles.navLink}>Usuarios</span>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/role">
                                <span className={styles.navLink}>Roles</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className={styles.layout_main}>
                {children}
            </main>
        </div>
    );
}

