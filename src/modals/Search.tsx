/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Person } from '../models/person'

export interface ReceivedProps {
  people: Person[]
  exclude?: Person
  onSelect: (person: Person) => void
  onCancel: () => void
}

interface ComponentState {
  searchText: string
  results: Person[]
}

class Search extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    searchText: "",
    results: []
  }

  @OF.autobind
  onSearchChanged(text: string) {
    const stext = text.toUpperCase()
    let startNameMatch = this.props.people.filter(p => 
      p.firstName.toUpperCase().startsWith(stext) ||
      p.lastName.toUpperCase().startsWith(stext) ||
      p.nickName.toUpperCase().startsWith(stext) ||
      p.maidenName.toUpperCase().startsWith(stext) ||
      p.alternateName.toUpperCase().startsWith(stext))
/*
    let midNameMatch = this.props.people.filter(p => 
      p.firstName.indexOf(text) >= 0 ||
      p.lastName.indexOf(text) >= 0 ||
      p.nickName.indexOf(text) >= 0 ||
      p.maidenName.indexOf(text) >= 0 ||
      p.alternateName.indexOf(text))
*/
    this.setState({
      searchText: text,
      results: startNameMatch
    })
  }
  
  containsSearch(name: string, search: string): boolean {
    if (name.toUpperCase().startsWith(search.toUpperCase())) {
      return true
    }
    return false
  }

  renderFound(search: string, pre: string, name: string, post: string): JSX.Element {
      const startText = name.slice(0, search.length)
      const endText = name.slice(search.length)
      return (
        <div>
          <span>{pre}</span>
          <span className="SearchBold">{startText}</span>
          <span>{endText}</span>
          <span>{post}</span>
        </div>
      )
  }

  @OF.autobind
  onRenderCell(person: Person, index: number, isScrolling: boolean): JSX.Element {
    
    let nameRender: JSX.Element | null
    if (this.props.exclude && person.personId === this.props.exclude.personId) {
      nameRender =(<span className="SearchDisabled">{person.fullName()}</span>)
    }
    else if (this.containsSearch(person.firstName, this.state.searchText)) {
      nameRender = this.renderFound(this.state.searchText, "", person.firstName, ` ${person.lastName}`)
    }
    else if (this.containsSearch(person.lastName, this.state.searchText)) {
      nameRender = this.renderFound(this.state.searchText, `${person.firstName} `, person.lastName, "")
    }
    else if (this.containsSearch(person.nickName, this.state.searchText)) {
      nameRender = this.renderFound(this.state.searchText, `${person.firstName} "`, person.nickName, `" ${person.lastName}`)
    }
    else if (this.containsSearch(person.maidenName, this.state.searchText)) {
      nameRender = this.renderFound(this.state.searchText, `${person.firstName} ${person.lastName} (`, person.maidenName, ")")
    }
    else if (this.containsSearch(person.alternateName, this.state.searchText)) {
      nameRender = this.renderFound(this.state.searchText, `${person.firstName} "`, person.alternateName, `" ${person.lastName}`)
    }
    else {
      nameRender = null
    }

    return (
      <div className="FilterLine">
        <OF.Button 
          className="SearchText"
          onClick={() => {
            if (!this.props.exclude || person.personId !== this.props.exclude.personId) {
              this.props.onSelect(person)
            }
          }}
        >
          {nameRender}
        </OF.Button>
      </div>
    );
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="HeaderContent HeaderContentThin">
          <OF.Label className="SearchLabel">
            Search:
          </OF.Label>
          <OF.TextField
            className="SearchInput"
            underlined={true}
            onChanged={text => this.onSearchChanged(text)}
            value={this.state.searchText}
            autoFocus={true}
          />  
        </div>
        <div className="ModalBody ModalBodyThin">
          <OF.List
            className="FilterList"
            items={this.state.results}
            onRenderCell={this.onRenderCell}
          />
        </div>
        <div className="FooterHolder">
          <div className="FooterContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={this.props.onCancel}
                iconProps={{ iconName: 'ChromeBack' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
