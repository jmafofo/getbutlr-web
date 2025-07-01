type ToolHeaderProps = {
  title: string;
  icon?: string;
  description?: string;
};

export default function ToolHeader({ title, icon, description }: ToolHeaderProps) {
  return (
    <div className="tool-header">
      <h1 className="tool-title">
        {icon && <span className="tool-icon">{icon}</span>} {title}
      </h1>
      {description && <p className="tool-description">{description}</p>}
    </div>
  );
}
