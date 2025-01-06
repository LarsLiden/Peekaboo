/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
export interface Relationship {
    relationshipId: string,
    type: RelationshipType,
    personId: string,
    name?: string | null
}

export enum RType {
    MARRIED_TO = "Married to",
    CHILD_OF = "Child of",
    PARENT_OF = "Parent of",
    DIVORCED_FROM = "Divorced from",
    DATING = "Dating",
    ONCE_DATED = "Once dated",
    WORDS_FOR = "Works for",
    BOSS_OF = "Boss of",
    WORKED_FOR = "Worked for",
    FORMER_BOSS_OF = "Former boss of",
    LIVES_WITH = "Lives with",
    LIVED_WITH = "Lived with",
    SIBLING_OF = "Sibling of",
    PM_BY = "PM by",
    PM_OF = "PM of",
    GRANDCHILD_OF = "Grandchild of",
    GRANDPARENT_OF = "Grandparent of",
    STEP_SIBLING_OF = "Step Sibling of",
    STEP_CHILD_OF = "Stepchild of",
    STEP_PARENT_OF = "Stepparent of"
};

export class RelationshipType {
    from: RType;
    to: RType;
    priority: number;

    static relationshipTypes: RelationshipType[] | null = null;

    static getRelationshipType(name: string): RelationshipType {
        if (!this.relationshipTypes) {
            this.init()
        }
        if (!this.relationshipTypes) {
            throw new Error('No relationship types');
        }
        const relationshipType = this.relationshipTypes.find(rt => rt.from.toString() === name );
        if (!relationshipType) {
            throw new Error(`Can't find rtype ${name}`);
        }
        return relationshipType
    }

    static addRType(priority: number, from: RType, to?: RType): void {
        if (!this.relationshipTypes) {
            this.relationshipTypes = [];
        }
        if (!to) {
            this.relationshipTypes.push(new RelationshipType(from, from, priority))   
        }
        else {
            this.relationshipTypes.push(new RelationshipType(from, to, priority))
            this.relationshipTypes.push(new RelationshipType(to, from, priority)) 
        }
    }
    
    static init(): void {
        // Create types
        this.addRType(1, RType.MARRIED_TO)
        this.addRType(1, RType.CHILD_OF, RType.PARENT_OF)
        this.addRType(2, RType.DATING)
        this.addRType(3, RType.SIBLING_OF)
        this.addRType(3, RType.GRANDCHILD_OF, RType.GRANDPARENT_OF)
        this.addRType(3, RType.STEP_SIBLING_OF)
        this.addRType(3, RType.STEP_CHILD_OF, RType.STEP_PARENT_OF)
        this.addRType(4, RType.LIVES_WITH)
        this.addRType(5, RType.WORDS_FOR, RType.BOSS_OF)
        this.addRType(6, RType.DIVORCED_FROM)
        this.addRType(6, RType.ONCE_DATED)
        this.addRType(6, RType.WORKED_FOR, RType.FORMER_BOSS_OF)
        this.addRType(6, RType.LIVED_WITH)
        this.addRType(6, RType.PM_BY, RType.PM_OF)
    } 

    constructor(from: RType, to: RType, priority: number) {
        this.from = from;
        this.to = to;
        this.priority = priority;
    } 
}