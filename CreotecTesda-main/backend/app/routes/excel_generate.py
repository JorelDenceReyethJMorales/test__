# backend/app/routes/excel_generate.py
import os
from flask import Blueprint, request, jsonify, send_file, current_app
from app.services.excel_filler import ExcelTemplateFiller
from datetime import datetime

# Import recent_downloads from your main app if needed
try:
    from run import recent_downloads
except ImportError:
    recent_downloads = []

excel_bp = Blueprint("excel_bp", __name__, url_prefix="/api")

DEFAULT_TEMPLATE_PATH = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "static", "excel", "template.xlsx")
)
DEFAULT_MAPPING = {}

@excel_bp.route("/generate", methods=["POST", "OPTIONS"])
def generate_excel():
    if request.method == "OPTIONS":
        return ("", 204)

    def err(msg, status=400):
        print(f"[ERROR] {msg}")
        return jsonify({"error": msg}), status

    if "file" not in request.files:
        return err("No file part 'file'")
    f = request.files["file"]
    fn = (f.filename or "").lower()
    if not fn.endswith((".xlsx", ".xlsm")):
        return err("Please upload an .xlsx or .xlsm file")

    mapping_json = request.form.get("mapping")

    template_path = getattr(current_app, "EXCEL_TEMPLATE_PATH", DEFAULT_TEMPLATE_PATH)
    print(f"[INFO] Using template: {template_path}  (exists={os.path.exists(template_path)})")

    try:
        filler = ExcelTemplateFiller(template_path, default_mapping=DEFAULT_MAPPING)
        out_io, out_name = filler.generate_from_filestorage(f, mapping_json)

        # Save file to static/generated
        output_dir = os.path.join("static", "generated")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, out_name)
        with open(output_path, "wb") as out_file:
            out_file.write(out_io.getbuffer())

        # Update history
        recent_downloads.insert(0, {
            "type": "tesda",  # or change to something like "excel" if needed
            "filename": out_name,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "url": f"/static/generated/{out_name}"
        })

    except Exception as e:
        return err(str(e), status=500)

    return send_file(
        output_path,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name=out_name,
    )