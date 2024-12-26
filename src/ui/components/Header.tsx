import { ResetStateButton } from "./ResetStateButton";

export default function Header() {
  return (
    <header className="header">
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <ResetStateButton />
    </header>
  );
}