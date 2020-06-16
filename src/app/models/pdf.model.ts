export class Pdf {
    constructor(
        public id?: string,
        public fileName?: string,
        public isTemplate?: boolean,
        public formName?: string,
        public field?: string,
        public exportValues?: string
    ){}
}
