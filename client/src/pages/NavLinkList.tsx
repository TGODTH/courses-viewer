import cx from "clsx";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { NavLink, Skeleton } from "@mantine/core";
import { IFileStructure } from "../types";
import { IoVideocam, IoFolder } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa6";

import React from "react";

interface INavLinkList {
  fileStructure: IFileStructure | null;
}
// TODO: Move out
enum FileTypeEnum {
  mp4 = "mp4",
  pdf = "pdf",
  downloadable = "downloadable",
}
function isFileType(value: string): value is FileTypeEnum {
  return value in FileTypeEnum;
}

const renderFileIcon = (fileType: FileTypeEnum, size: string = "1rem") => {
  switch (fileType) {
    case FileTypeEnum.mp4:
      return <IoVideocam size={size} />;
    case FileTypeEnum.pdf:
      return <FaFilePdf size={size} />;
    default:
      return <IoMdDownload size={size} />;
  }
};
const renderNavLink = (
  structure: IFileStructure,
  currentPage: string,
  path = ""
) => {
  return Object.entries(structure)
    .sort(([a], [b]) => {
      const lowerA = a.toLowerCase();
      const lowerB = b.toLowerCase();

      const isANumber = !isNaN(parseInt(lowerA));
      const isBNumber = !isNaN(parseInt(lowerB));

      if (isANumber && isBNumber) {
        return parseInt(lowerA, 10) - parseInt(lowerB, 10);
      } else if (isANumber) {
        return -1;
      } else if (isBNumber) {
        return 1;
      } else {
        return lowerA.localeCompare(lowerB);
      }
    })
    .map(([key, value]) => {
      const newPath = path ? `${path}/${key}` : key;
      const isCurrentActive =
        decodeURIComponent(currentPage) === `/video/${newPath}`;
      if (typeof value === "string") {
        if (!isFileType(value)) return null;
        return (
          <React.Fragment key={newPath}>
            <NavLink
              onClick={() => {
                if (value !== FileTypeEnum.downloadable)
                  localStorage.setItem("lastPath", `/video/${newPath}`);
              }}
              renderRoot={({ className, ...others }) => {
                if (value === FileTypeEnum.downloadable) {
                  return (
                    <a
                      href={
                        (import.meta.env.MODE === "production"
                          ? window.location.origin
                          : "http://localhost:3000") +
                        "/api/download/" +
                        encodeURIComponent(newPath)
                      }
                      className={cx(className, {
                        "active-class": isCurrentActive,
                      })}
                      download
                      {...others}
                    />
                  );
                } else {
                  return (
                    <RouterNavLink
                      to={`/video/${newPath}`}
                      className={({ isActive }) =>
                        cx(className, { "active-class": isActive })
                      }
                      {...others}
                    />
                  );
                }
              }}
              active={isCurrentActive}
              label={key}
              leftSection={renderFileIcon(value, "1rem")}
            />
            {isCurrentActive &&
              (() => {
                setTimeout(() => {
                  const activeNavLink =
                    document.querySelector("a.active-class");
                  if (activeNavLink) {
                    activeNavLink.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    });
                  }
                }, 50);
                return null;
              })()}
          </React.Fragment>
        );
      } else {
        return (
          <NavLink
            key={newPath}
            label={key}
            leftSection={<IoFolder size="1rem" />}
            defaultOpened={decodeURIComponent(currentPage).includes(
              `/video/${newPath}`
            )}
          >
            {renderNavLink(value, currentPage, newPath)}
          </NavLink>
        );
      }
    });
};

const NavLinkList = ({ fileStructure }: INavLinkList) => {
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <>
      {fileStructure
        ? renderNavLink(fileStructure, currentPage)
        : Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={"ses" + index} h={28} mt="sm" animate={false} />
            ))}
    </>
  );
};

export default NavLinkList;
