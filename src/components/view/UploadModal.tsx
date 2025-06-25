import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select
} from '@chakra-ui/react'
import axios from 'axios'

import { DemsApiFp, GeotiffsApiFp, ObjmeshesApiFp } from '../../api/api'
import { Configuration } from '../../api/configuration'
import { useDemsStore } from '../../store/demStore'
import { useGeotiffsStore } from '../../store/geotiffsStore'
import { useOBJMeshesStore } from '../../store/objMeshesStore'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState('GeoTIFF')

  const { fetchDems } = useDemsStore()
  const { fetchGeotiffs } = useGeotiffsStore()
  const { fetchOBJMeshes } = useOBJMeshesStore()

  const createConfiguration = () =>
    new Configuration({
      basePath: import.meta.env.VITE_APP_API_BASE_PATH,
      username: import.meta.env.VITE_APP_API_USERNAME,
      password: import.meta.env.VITE_APP_API_PASSWORD
    })

  const handleUpload = async () => {
    if (!file) return
    const configuration = createConfiguration()
    try {
      if (type === 'DEM') {
        const api = DemsApiFp(configuration)
        const request = await api.demsUploadDem(name, file)
        await request(axios, configuration.basePath || '')
        fetchDems()
      } else if (type === 'GeoTIFF') {
        const api = GeotiffsApiFp(configuration)
        const request = await api.geotiffsUploadGeotiff(name, file)
        await request(axios, configuration.basePath || '')
        fetchGeotiffs()
      } else if (type === 'OBJMesh') {
        const api = ObjmeshesApiFp(configuration)
        const request = await api.objmeshesUploadMesh(name, file)
        await request(axios, configuration.basePath || '')
        fetchOBJMeshes()
      }
      setName('')
      setFile(null)
      onClose()
    } catch (error) {
      console.error('Upload failed', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Layer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Layer Type</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="GeoTIFF">GeoTIFF</option>
              <option value="DEM">DEM</option>
              <option value="OBJMesh">OBJ Mesh</option>
            </Select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>File</FormLabel>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpload}>
            Upload
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UploadModal
