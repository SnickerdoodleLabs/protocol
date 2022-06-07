import { IpfsCID } from "@objects/IpfsCID";
import { SDQLString } from "@objects/SDQLString";

// Yes the name is technically redundant
export class NewSDQLQuery {
    public constructor(public query: SDQLString) { }
}

export class SDQLQuery extends NewSDQLQuery {
    public constructor(public cid: IpfsCID, public query: SDQLString) {
        super(query);
    }
}