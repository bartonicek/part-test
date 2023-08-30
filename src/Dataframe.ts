export class Dataframe {
  n: number;
  rows: Record<string, any>[];

  constructor(rows: Record<string, any>[]) {
    this.n = rows.length;
    this.rows = rows;
  }

  row = (index: number) => this.rows[index];
}
