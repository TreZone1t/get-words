import { Menubar, MenubarMenu, MenubarTrigger } from "./ui/menubar"
import Link from "next/link"

export default function NavMenu({ menu , title }: { menu: {title: string, href: string}[] , title: React.ReactNode }) {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">
        <Link href="/" passHref legacyBehavior>
        {title}
        </Link>
        </MenubarTrigger>
        {menu && menu.map((item) => (
          <MenubarMenu key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <MenubarTrigger >{item.title}</MenubarTrigger>
            </Link>
          </MenubarMenu>
        ))}
      </MenubarMenu>
    </Menubar>
  )
}