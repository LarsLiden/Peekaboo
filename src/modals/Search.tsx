/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Person } from '../models/person'
import { Tag } from '../models/models'
import { setStatePromise } from '../Util'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  allPeople: Person[];
  allTags: Tag[];
  exclude?: Person;
  onSelect: (person: Person) => void;
  onCancel: () => void;
  onClickTagFilter?: () => void;
  onNewPerson?: () => void;
  onClickQuiz?: () => void;
  onClickSearchFilter: ((searchTerm: string) => void) | null;
}

interface ComponentState {
  searchText: string;
  byNameOnly: boolean;
  results: Person[];
}

class Search extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    searchText: "",
    byNameOnly: true,
    results: []
  }

  componentWillMount() {
    this.setState({results: this.props.allPeople})
  }

  @autobind
  onSearchChanged(text: string | undefined) {
    if (!text || text.length === 0) {
      this.setState({
        searchText: text || "",
        results: [...this.props.allPeople]
      })
      return
    }
    const stext = text.toUpperCase()

    let matched: Person[] = []
    if (this.state.byNameOnly) {
      matched = this.props.allPeople.filter(p =>
        p.fullName().toUpperCase().startsWith(stext) ||
        p.firstName.toUpperCase().startsWith(stext) ||
        p.lastName.toUpperCase().startsWith(stext) ||
        p.nickName.toUpperCase().startsWith(stext) ||
        p.maidenName.toUpperCase().startsWith(stext) ||
        p.alternateName.toUpperCase().startsWith(stext))
    }
    else {
      matched = this.props.allPeople.filter(p =>
        p.searchData(this.props.allPeople, this.props.allTags).includes(stext))
    }

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
      results: matched
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

  @autobind
  async onToggleSearch(ev: React.MouseEvent<HTMLElement>, checked: boolean) {
    await setStatePromise(this, {byNameOnly: checked})
    this.onSearchChanged(this.state.searchText)
  }

  @autobind
  onRenderCell(person: Person, index: number, isScrolling: boolean): JSX.Element {
    
    let nameRender: JSX.Element | null
    if (this.props.exclude && person.personId === this.props.exclude.personId) {
      nameRender = (<span className="SearchDisabled">{person.fullName()}</span>)
    }
    else if (this.containsSearch(person.fullName(), this.state.searchText)) {
      nameRender = this.renderFound(this.state.searchText, "", person.fullName(), ``)
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
      nameRender = (
        <div>
          <span>{person.fullName()}</span>
        </div>
      )
    }

    return (
      <div className="SectionBorder">
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
/*
            <OF.Label className="SearchLabel">
              {this.state.byNameOnly ? "Search by Name:" : "Search All Fields:"}
            </OF.Label>
                        <OF.Toggle
              className="FloatRight"
              defaultChecked={true}
              label="Name Only"
              onChange={this.onToggleSearch}
            />
            LARS */
  public render() {
    return (
      <div className="ModalPage">
        <div className="HeaderHolder HeaderHolderMedium">
          <div className="HeaderContent">
            <OF.IconButton
                className="FloatLeft"
                onClick={() => {}}
                iconProps={{ iconName: 'ProfileSearch' }}
            />
            <OF.TextField
              className="SearchInput"
              underlined={true}
              onChange={(event, text) => this.onSearchChanged(text)}
              value={this.state.searchText}
              autoFocus={true}
            />
            <div className="SearchToggleGroup">
              <div className='SearchToggleTitle'>
                {this.state.byNameOnly ? "By Name" : "By All"}
              </div>
              <OF.Toggle
                className="FloatRight"
                defaultChecked={true}
                inlineLabel={false}
                label=""
                onChange={this.onToggleSearch}
              />
            </div>
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent ModalBodyHeaderMedium">
            <OF.List
              items={this.state.results}
              onRenderCell={this.onRenderCell}
              data-is-scrollable="true"
              onShouldVirtualize={() => {return true }}
            />
          </div>
        </div>
        <div className="FooterHolder">
          <div className="FooterContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={this.props.onCancel}
                iconProps={{ iconName: 'ChromeBack' }}
            />
            {this.props.onClickTagFilter &&
              <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={this.props.onClickTagFilter}
                iconProps={{ iconName: 'Filter' }}
              />
            }
            {this.props.onClickSearchFilter &&
              <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={() => this.props.onClickSearchFilter!(this.state.searchText.toUpperCase())}
                iconProps={{ iconName: 'Filter' }}
              />
            }
            {this.props.onNewPerson &&
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatLeft"
                  onClick={this.props.onNewPerson}
                  iconProps={{ iconName: 'CirclePlus' }}
              />
            }
            {this.props.onClickQuiz && 
              <OF.Button
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.props.onClickQuiz}
              >
                <OF.Image
                  className="QuizImageHolder"
                  src={"https://peekaboo.blob.core.windows.net/resources/quizicon.png"}
                  width={100}
                  height={30}
                />
              </OF.Button>
            }
            </div>
        </div>
      </div>
    );
  }
}

export default Search;
