import NavLinkList from "./NavLinkList";
import { useCourseStructure } from "../services/context";
import { Box, Title } from "@mantine/core";

const HomePage = () => {
  const courseStructure = useCourseStructure();
  return (
    <Box>
      <Title order={2} mt="sm" lh="md" fw={500} ta="center">
        สารบัญ
      </Title>
      <NavLinkList fileStructure ={courseStructure} />
    </Box>
  );
};

export default HomePage;
