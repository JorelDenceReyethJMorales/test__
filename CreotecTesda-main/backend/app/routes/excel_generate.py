# backend/app/routes/excel_generate.py
import os
from flask import Blueprint, request, jsonify, send_file, current_app
from app.services.excel_filler import ExcelTemplateFiller

excel_bp = Blueprint("excel_bp", __name__, url_prefix="/api")

DEFAULT_TEMPLATE_PATH = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "static", "excel", "template.xlsx")
)
DEFAULT_MAPPING = {}

@excel_bp.route("/generate", methods=["POST", "OPTIONS"])
def generate_excel():
    if request.method == "OPTIONS":
        # allow CORS preflight to finish fast
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

    # allow override via config if you want
    template_path = getattr(current_app, "EXCEL_TEMPLATE_PATH", DEFAULT_TEMPLATE_PATH)
    print(f"[INFO] Using template: {template_path}  (exists={os.path.exists(template_path)})")

    try:
        filler = ExcelTemplateFiller(template_path, default_mapping=DEFAULT_MAPPING)
        out_io, out_name = filler.generate_from_filestorage(f, mapping_json)
    except Exception as e:
        return err(str(e), status=500)

    return send_file(
        out_io,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name=out_name,
    )
