import logging
import time
from functools import wraps

logger = logging.getLogger(__name__)

def log_execution_time(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            start_time = time.time()
            #logger.info(f"Start executing: {view_func.__name__}")
            response = view_func(request, *args, **kwargs)
            end_time = time.time()
            execution_time = end_time - start_time
            logger.info(f"Execution time for {view_func.__name__}: {execution_time:.4f} seconds")
            return response
        except Exception as e:
            logger.exception(f"Error in log_execution_time decorator: {e}")
            raise
    return _wrapped_view
