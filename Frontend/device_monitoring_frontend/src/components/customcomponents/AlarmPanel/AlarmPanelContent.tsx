import { HStack, Tag } from "@chakra-ui/react";

export const DeviceTags = ({ tags, removeTag }: { tags: string[], removeTag: (index: number) => void }) => {
  return (
    <HStack paddingLeft={"0.3rem"} gap={"0.5rem"} wrap={"wrap"}>
      {tags.map((tag, index) => (
        <Tag.Root key={index} variant="outline" colorPalette={"gray"} color="black" borderRadius="lg" padding="0.2rem 0.6rem" size="md">
          <Tag.Label>{tag}</Tag.Label>
          <Tag.EndElement>
            <Tag.CloseTrigger cursor={"pointer"} onClick={() => removeTag(index)} />
          </Tag.EndElement>
        </Tag.Root>
      ))}
    </HStack>
  );
};