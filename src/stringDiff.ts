/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */

// Similarity of the two strings using levenstein distance.
export default function stringDiff(word1Mixed: string, word2Mixed: string): number {
    // Make case insensitive
    let word1 = word1Mixed.toLowerCase();
    let word2 = word2Mixed.toLowerCase();

    if ((word1 !== null) && (word2 !== null)) {
        let levensteinDistance = getRawSimilarity(word1, word2);
        let maxLen = Math.max(word1.length, word2.length);

        if (maxLen === 0) {
            return 1
        }
        
        return 1 - levensteinDistance / maxLen
    }
    return 0
}

function getRawSimilarity(word1: string, word2: string): number {
    if ((word1 !== null) && (word2 !== null)) {
        let len1 = word1.length;
        let len2 = word2.length;
        if (len1 === 0) {
            return len2
        }
        if (len2 === 0) {
            return len1
        }

        // Set up matrix
        let mx: number[][] = []
        for (let i = 0; i < len1 + 1; i = i + 1) {
            mx[i] = []
        }
        for (let i = 0; i <= len1; i = i + 1) {
            mx[i][0] = i
        }
        for (let j = 0; j <= len2; j = j + 1) {
            mx[0][j] = j
        }

        // Process matgrix
        for (let i = 1; i <= len1; i = i + 1) {
            for (let j = 1; j <= len2; j = j + 1) {
                
                let cost = wordCost(word1, i - 1, word2, j - 1);
                mx[i][j] = min(mx[i - 1][j] + 1, mx[i][j - 1] + 1, mx[i - 1][j - 1] + cost)
            }
        }
        return mx[len1][len2];
    }
    return 0;
}

function wordCost(word1: string, index1: number, word2: string, index2: number): number {
    if ((word1 != null) && (word2 != null))
    {
        return word1[index1] !== word2[index2] ? 1 : 0
    }
    return 0;
}

function min(num1: number, num2: number, num3: number): number {
    return Math.min(num1, Math.min(num2, num3))
}
