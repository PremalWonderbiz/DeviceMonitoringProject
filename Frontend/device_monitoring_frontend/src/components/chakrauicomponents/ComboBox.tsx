"use client"

import {
  Badge,
  Combobox,
  Portal,
  Wrap,
  createListCollection,
} from "@chakra-ui/react"
import { useMemo, useState } from "react"

const ComboBox = ({skills, selectedSkills, setSelectedSkills} : any) => {
  const [searchValue, setSearchValue] = useState("")

  const filteredItems = useMemo(
    () =>
      skills.filter((item : any) =>
        item.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  )

  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems],
  )

  const handleValueChange = (details: Combobox.ValueChangeDetails) => {
    setSelectedSkills(details.value)
  }

  return (
    <Combobox.Root
      multiple
      closeOnSelect
      width="320px"
      value={selectedSkills}
      collection={collection}
      onValueChange={handleValueChange}
      onInputValueChange={(details) => setSearchValue(details.inputValue)}
    >
      <Wrap gap="2">
        {selectedSkills.map((skill : any) => (
          <Badge padding={"0.5rem"} key={skill}>{skill}</Badge>
        ))}
      </Wrap>

      <Combobox.Label>Select Skills</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input placeholder="Select Devices" padding={"0.5rem"}/>
        <Combobox.IndicatorGroup>
          <Combobox.Trigger padding={"0.5rem"}/>
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content backgroundColor={"#181818"} color={"#fff"} padding={"0.5rem 1rem"} zIndex={"popover"}>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Skills</Combobox.ItemGroupLabel>
              {filteredItems.map((item : any) => (
                <Combobox.Item key={item} item={item}>
                  {item}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
              <Combobox.Empty>No skills found</Combobox.Empty>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

export default ComboBox;
