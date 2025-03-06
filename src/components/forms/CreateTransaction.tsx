export default function CreateTransaction() {
  return (
    <form>
      <h3>Crear nueva transacción</h3>
      <label htmlFor="description">Descripción</label>
      <input type="text" id="description" name="description" required />
      <br></br>

      <label htmlFor="fecha">Fecha:</label>
      <input type="text" id="fecha" name="fecha" required />
      <br></br>

      <label htmlFor="monto">Monto:</label>
      <input type="text" id="monto" name="monto" required />
      <br></br>

      <label htmlFor="cuenta">Cuenta:</label>
      <input type="text" id="cuenta" name="cuneta" required />
    </form>
  );
}
