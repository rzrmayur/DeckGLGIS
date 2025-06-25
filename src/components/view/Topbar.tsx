import { Box, Button, useDisclosure } from '@chakra-ui/react'
import UploadModal from './UploadModal'

const Topbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box
        as="header"
        className="w-full bg-gray-800 text-white p-4 flex justify-between items-center"
      >
        <h1 className="text-xl">DeckGL GIS</h1>
        <Button size="sm" colorScheme="teal" onClick={onOpen}>
          Upload
        </Button>
      </Box>
      <UploadModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default Topbar
