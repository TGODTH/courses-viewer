import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation } from "react-router-dom";
import NavLinkList from "../pages/NavLinkList";
import { useCourseStructure } from "../services/context";

export const CollapseSidebar = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const courseStructure = useCourseStructure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 325,
        breakpoint: "sm",
        collapsed: {
          mobile: !mobileOpened,
          desktop: !desktopOpened || location.pathname === "/",
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          {location.pathname !== "/" && (
            <>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
            </>
          )}
          <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
            <Title order={1} lh="xs">
              English Course
            </Title>
          </Link>
        </Group>
      </AppShell.Header>
      {location.pathname !== "/" && (
        <AppShell.Navbar p="md">
          <Title order={2} lh="md" fw={500} ta="center">
            สารบัญ
          </Title>
          <ScrollArea offsetScrollbars miw="90%" maw="100%">
            <NavLinkList list={courseStructure} />
          </ScrollArea>
          <AppShell.Section mt="auto">
            <Text fz="12px" opacity="45%" ta="center">
              created by Thanachart Sangmola
            </Text>
          </AppShell.Section>
        </AppShell.Navbar>
      )}
      <AppShell.Main pt="60">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default CollapseSidebar;
