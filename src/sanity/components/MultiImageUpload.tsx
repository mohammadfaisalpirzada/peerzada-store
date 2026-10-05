import { useCallback, useRef } from 'react';
import { set, insert, type ArrayOfObjectsInputProps } from 'sanity';
import { Button, Flex, Card, Stack, Text, useToast } from '@sanity/ui';
import { UploadIcon } from '@sanity/icons';
import { useClient } from 'sanity';

const MAX_IMAGES = 5;

export function MultiImageUpload(props: ArrayOfObjectsInputProps) {
  const { value, onChange } = props;
  const toast = useToast();
  const client = useClient({ apiVersion: '2023-05-03' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = value?.length || 0;
    const allowed = MAX_IMAGES - currentCount;

    if (allowed <= 0) {
      toast.push({ status: 'warning', title: `Maximum ${MAX_IMAGES} images allowed` });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, allowed);
    let uploaded = 0;

    for (const file of filesToUpload) {
      try {
        const asset = await client.assets.upload('image', file, {
          contentType: file.type,
          filename: file.name,
        });

        const imageRef = {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        };

        if (value && value.length > 0) {
          onChange(insert([imageRef], 'after', [-1]));
        } else {
          onChange(set([imageRef]));
        }
        uploaded++;
      } catch (err) {
        console.error('Upload failed:', err);
        toast.push({ status: 'error', title: `Failed: ${file.name}` });
      }
    }

    if (uploaded > 0) {
      toast.push({ status: 'success', title: `${uploaded} image(s) uploaded` });
    }
    if (inputRef.current) inputRef.current.value = '';
  }, [value, onChange, client, toast]);

  const remainingSlots = MAX_IMAGES - (value?.length || 0);

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {remainingSlots > 0 && (
        <Card padding={3} radius={2} border style={{ borderStyle: 'dashed', borderColor: '#ccc' }}>
          <Flex direction="column" align="center" gap={2}>
            <Text size={1} muted>
              {remainingSlots} slot{remainingSlots > 1 ? 's' : ''} remaining (max {MAX_IMAGES})
            </Text>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            <Button
              tone="primary"
              mode="ghost"
              icon={UploadIcon}
              text={`Upload ${remainingSlots} Images`}
              onClick={() => inputRef.current?.click()}
            />
            <Text size={0} muted>
              You can select multiple images at once from your gallery
            </Text>
          </Flex>
        </Card>
      )}
    </Stack>
  );
}
