import React, { useState, useEffect } from 'react'
import xor from 'lodash.xor'
import { Close } from '@styled-icons/material-outlined/Close'
import { FilterList } from '@styled-icons/material-outlined/FilterList'

import Heading from 'components/Heading'
import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import Radio from 'components/Radio'
import SearchInput from 'components/SearchInput'
import * as S from './styles'
import { ParsedUrlQueryInput } from 'querystring'

export type ItemProps = {
  title: string
  name: string
  type: string
  fields: Field[]
}

type Field = {
  label: string
  name: string
}

type Values = ParsedUrlQueryInput

export type ExploreSidebarProps = {
  items: ItemProps[]
  initialValues?: Values
  onFilter: (values: Values) => void
}

const ExploreSidebar = ({
  items,
  onFilter,
  initialValues = {}
}: ExploreSidebarProps) => {
  const [values, setValues] = useState(initialValues)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onFilter(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const handleRadio = (name: string, value: string | boolean) => {
    setValues((s) => ({ ...s, [name]: value }))
  }

  const handleCheckbox = (name: string, value: string) => {
    const currentList = (values[name] as []) || []
    setValues((s) => ({ ...s, [name]: xor(currentList, [value]) }))
  }

  const handleFilterMenu = () => {
    setIsOpen(false)
  }
  const handleSearch = (name: string, value: string) => {
    if (value.length > 3) {
      const exec = setTimeout(() => {
        setValues((s) => ({ ...s, [name]: value }))
      }, 2000)
      return () => clearTimeout(exec)
    }
  }
  const Teste = () => {
    console.log('ok')
  }
  return (
    <S.Wrapper isOpen={isOpen}>
      <S.Overlay aria-hidden={isOpen} />
      <S.IconWrapper>
        <FilterList aria-label="open filters" onClick={() => setIsOpen(true)} />
        <Close aria-label="close filters" onClick={() => setIsOpen(false)} />
      </S.IconWrapper>

      <S.Content>
        <Heading line="bottom" lineColor="secondary" size="small">
          Procurar
        </Heading>
        <SearchInput
          aria-label="Search"
          iconPosition="right"
          placeholder="Pesquisar Game"
          initialValue={String(values['name'])}
          dropdown={false}
          onInputChange={(v) => handleSearch('name', v)}
        />

        {items.map((item) => (
          <S.Items key={item.title}>
            <Heading line="bottom" lineColor="secondary" size="small">
              {item.title}
            </Heading>

            {item.type === 'checkbox' &&
              item.fields.map((field) => (
                <Checkbox
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  labelFor={field.name}
                  isChecked={(values[item.name] as string[])?.includes(
                    field.name
                  )}
                  onCheck={() => handleCheckbox(item.name, field.name)}
                />
              ))}

            {item.type === 'radio' &&
              item.fields.map((field) => (
                <Radio
                  key={field.name}
                  id={field.name}
                  value={field.name}
                  name={item.name}
                  label={field.label}
                  labelFor={field.name}
                  defaultChecked={
                    String(field.name) === String(values[item.name])
                  }
                  onChange={() => handleRadio(item.name, field.name)}
                />
              ))}
          </S.Items>
        ))}
      </S.Content>

      <S.Footer>
        <Button fullWidth size="medium" onClick={handleFilterMenu}>
          Close
        </Button>
      </S.Footer>
    </S.Wrapper>
  )
}

export default ExploreSidebar
