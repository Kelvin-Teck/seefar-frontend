import { Modal, useMantineTheme } from "@mantine/core";
import PostCreator from "../PostCreator/PostCreator";

function ShareModal({ modalOpened, setModalOpened }) {
  const theme = useMantineTheme();

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="lg"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      radius="md"
      title={<b>Create Post</b>}
    >
      <PostCreator onFinish={() => setModalOpened(false)} />
    </Modal>
  );
}

export default ShareModal;
