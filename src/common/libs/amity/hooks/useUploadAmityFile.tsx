import { ContentFeedType, FileRepository } from '@amityco/ts-sdk-react-native';
import { showErrorToast } from 'common/libs/toast';
import { useCallback, useState } from 'react';

interface UploadRequest {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileMediaType: 'image' | 'video';
}

export function useUploadAmityFile() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const upload = useCallback(
    async ({ fileUrl, fileName, fileType, fileMediaType }: UploadRequest) => {
      const formData = new FormData();
      formData.append('files', {
        type: fileType,
        name: fileName,
        uri: fileUrl,
      });

      let result: Amity.Cached<Amity.File<'video' | 'image'>[]>;

      if (fileMediaType == 'video') {
        result = await FileRepository.uploadVideo(
          formData,
          ContentFeedType.POST,
          setUploadProgress,
        );
      } else {
        result = await FileRepository.uploadImage(formData, setUploadProgress);
      }

      return result.data;
    },
    [],
  );

  return { upload, uploadProgress };
}
