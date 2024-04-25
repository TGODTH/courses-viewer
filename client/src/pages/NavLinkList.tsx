import { NavLink, Skeleton } from "@mantine/core";
import { IFileStructure } from "../types";
import { IoVideocam } from "react-icons/io5";

interface INavLinkList {
  list: IFileStructure | null;
}

const renderNavLink = (structure: IFileStructure, path = "") => {
  return Object.entries(structure)
    .sort(
      ([a], [b]) =>
        parseInt(a.split(".").shift()!, 10) -
        parseInt(b.split(".").shift()!, 10)
    )
    .map(([key, value]) => {
      const newPath = path ? `${path}/${key}` : key;
      if (typeof value === "string" || value === null) {
        if (value === "mp4")
          return (
            <NavLink
              key={newPath}
              href={`/video/${newPath}`}
              label={key.substring(0, key.lastIndexOf("."))}
              leftSection={<IoVideocam size="1rem" />}
            />
          );
      } else {
        return (
          <NavLink
            key={newPath}
            label={key}
            defaultOpened={path ? false : true}
          >
            {renderNavLink(value, newPath)}
          </NavLink>
        );
      }
    });
};

const NavLinkList = ({ list }: INavLinkList) => {
  return (
    <>
      {list
        ? renderNavLink(list)
        : Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
    </>
  );
};

export default NavLinkList;
