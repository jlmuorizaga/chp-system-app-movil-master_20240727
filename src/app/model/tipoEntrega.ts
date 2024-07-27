export class TipoEntrega {
    private tipo!: string;

    public setTipo(tipo: string) {
        this.tipo = tipo;
    }

    public getTipo(): string {
        return this.tipo;
    }
}