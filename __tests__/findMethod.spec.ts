import {mapDiffToKeys} from '../src/keys-detective/map-diff-to-keys';
import {DiffDeleted} from 'deep-diff';

describe('mapDiffToKeys', () => {
    it('should pass when no extra keys found in empty json object block', () => {
        const diff = mapDiffToKeys([<DiffDeleted<{}>>{
            kind: 'D',
            path: ['dummy'],
            lhs: {}
        }], 'lhs');
        expect(diff).toEqual("");
    });
});